#import "ApplicationMods.h"

@implementation ApplicationMods

+ (NSArray*) compiledMods
{
	NSMutableArray *modules = [NSMutableArray array];
	[modules addObject:[NSDictionary dictionaryWithObjectsAndKeys:@"download1",@"name",@"com.download1",@"moduleid",@"0.1",@"version",@"d488c310-cf60-4b0d-87a8-8ecddbb4df99",@"guid",@"",@"licensekey",nil]];
	return modules;
}

@end
